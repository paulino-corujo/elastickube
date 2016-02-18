FROM nginx

# Create cache folder
RUN mkdir -p /data/nginx/cache && rm -f /etc/nginx/conf.d/default.conf

# Add configuration files
ADD nginx.conf /etc/nginx/nginx.conf
ADD ./conf.d /etc/nginx/conf.d

