class UsersActionCreatorService {
    constructor(actions, dispatcher, usersAPI, invitesAPI) {
        'ngInject';

        this._actions = actions;
        this._dispatcher = dispatcher;
        this._usersAPI = usersAPI;
        this._invitesAPI = invitesAPI;

        usersAPI.addOnUpdatedListener((users) => this._dispatcher.dispatch({ type: this._actions.USERS_UPDATED, users }));
    }

    subscribe() {
        this._dispatcher.dispatch({ type: this._actions.USERS_SUBSCRIBE });

        return this._usersAPI.subscribe()
            .then((users) => this._dispatcher.dispatch({ type: this._actions.USERS_SUBSCRIBED, users }));
    }

    update(user) {
        this._dispatcher.dispatch({ type: this._actions.USERS_UPDATE, user });

        return this._usersAPI.update(user)
            .then((updatedUser) => this._dispatcher.dispatch({ type: this._actions.USERS_UPDATED, user: updatedUser }));
    }

    invite(invitations) {
        this._dispatcher.dispatch({ type: this._actions.USERS_INVITE, invitations });

        return this._invitesAPI.create(invitations)
            .then(() => this._dispatcher.dispatch({ type: this._actions.USERS_INVITED }));
    }
}

export default UsersActionCreatorService;
