import binascii
import glob
import logging
import os

from git.repo import Repo
from git.exc import InvalidGitRepositoryError
from tornado.gen import coroutine, Return, sleep
from yaml import load, load_all

from data.query import Query

REPO_DIRECTORY = '/var/elastickube/charts'


class GitSync(object):

    def __init__(self, settings):
        logging.info("Initializing GitSync for '%s'", settings["charts"]["repo_url"])

        self.database = settings["database"]
        self.charts = dict()

        try:
            self.repo = Repo(REPO_DIRECTORY)
        except InvalidGitRepositoryError:
            logging.info("Cloning repository in %s", REPO_DIRECTORY)
            self.repo = Repo.clone_from(settings["charts"]["repo_url"], REPO_DIRECTORY)

    @coroutine
    def sync_loop(self):
        yield self.sync()

        while True:
            synced_head = self.repo.head
            try:
                self.repo.remotes.origin.pull()

                if synced_head != self.repo.head:
                    yield self.sync()
            except:
                logging.exception("Failed to pull repository.")

            yield sleep(5)

    @coroutine
    def sync(self):
        logging.info("Syncing %s", REPO_DIRECTORY)

        charts = yield Query(self.database, "Charts").find()
        for chart in charts:
            path = chart["path"]
            self.charts[path] = chart

        discovered_charts = dict()
        for subdir, _, files in os.walk(REPO_DIRECTORY):
            for chart_file in files:
                if chart_file == "Chart.yaml":
                    try:
                        discovered_charts[subdir] = yield self.import_chart(subdir)
                    except Exception:
                        logging.exception("Failed to import chart at '%s'", subdir)

        for path, existing in self.charts.iteritems():
            discovered = discovered_charts.get(path, None)

            if discovered is None:
                logging.debug("Deleting chart %(name)s", existing)
                yield Query(self.database, 'Charts').remove(existing)
            else:
                discovered["_id"] = existing["_id"]

                if discovered["commit"] != existing["commit"]:
                    logging.debug("Updating existing chart %(name)s", discovered)
                    yield Query(self.database, "Charts").update(discovered)

        for path, discovered in discovered_charts.iteritems():
            if discovered and "_id" not in discovered:
                logging.debug("Inserting new chart %(name)s", discovered)
                yield Query(self.database, "Charts").insert(discovered)

        self.charts = discovered_charts

    @coroutine
    def import_chart(self, directory):
        chart_path = os.path.join(directory, "Chart.yaml")

        with open(chart_path, "r") as stream:
            chart = load(stream)
            chart["path"] = directory

            commit = self.repo.iter_commits(paths=chart_path).next()
            chart["commit"] = binascii.hexlify(commit.binsha)
            chart["committed_date"] = commit.committed_date
            chart["resources"] = []

            manifests = yield self.import_manifests(directory)
            for _, manifest in manifests.iteritems():
                if commit.committed_date < manifest["commit"].committed_date:
                    chart["commit"] = binascii.hexlify(manifest["commit"].binsha)
                    chart["committed_date"] = manifest["commit"].committed_date

                for resource in manifest["resources"]:
                    chart["resources"].append(resource)

            raise Return(chart)

    @coroutine
    def import_manifests(self, directory):
        manifests = dict()

        manifests_path = os.path.join(directory, "manifests", "*.yaml")
        for file in glob.glob(manifests_path):
            with open(file, "r") as stream:
                manifests[file] = dict(
                    resources=[resource for resource in load_all(stream)],
                    commit=self.repo.iter_commits(paths=file).next()
                )

        raise Return(manifests)
