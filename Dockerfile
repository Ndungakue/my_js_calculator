# Use the official nginx image as base
FROM nginx:alpine

# Copy the static files to nginx's default public directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 