#!/bin/bash
# Shumanbeans Wedding Website Deployment Script
# Run this on your Digital Ocean droplet

set -e  # Exit on any error

echo "🚀 Starting Shumanbeans wedding website deployment..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "🔧 Installing Node.js, nginx, git, and other dependencies..."
apt install -y nginx git curl

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 globally
echo "🔧 Installing PM2 process manager..."
npm install -g pm2

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /var/www
cd /var/www

# Clone the Shumanbeans wedding website repository
echo "📥 Cloning Shumanbeans wedding website repository..."
if [ -d "shumanbeans" ]; then
    echo "Directory exists, updating..."
    cd shumanbeans
    git pull origin refactor/kairos-to-wedding-transformation
else
    git clone https://github.com/skylerahuman/shumanbeans.git
    cd shumanbeans
fi

# Install dependencies
echo "📦 Installing application dependencies..."
yarn install

# Build the application
echo "🏗️  Building the application..."
yarn build

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete shumanbeans 2>/dev/null || true  # Delete if exists
pm2 start "yarn start" --name "shumanbeans"
pm2 startup
pm2 save

# Configure Nginx
echo "🔧 Configuring Nginx reverse proxy..."
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/shumanbeans;
    index index.html index.htm index.nginx-debian.html;
    
    server_name shumanbeans.com www.shumanbeans.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS (for future SSL)
ufw --force enable

# Check service status
echo "📊 Checking service status..."
echo "Nginx status:"
systemctl status nginx --no-pager -l

echo "PM2 status:"
pm2 status

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "✅ Shumanbeans wedding website is now running on this server"
echo "✅ Nginx is configured as reverse proxy for shumanbeans.com"
echo "✅ PM2 is managing the Node.js application"
echo "✅ Firewall is configured"
echo ""
echo "🌐 Your wedding website should be accessible at:"
echo "    - http://$(curl -s ifconfig.me)"
echo "    - http://shumanbeans.com (once DNS is configured)"
echo "💰 Server cost: $4/month"
echo ""
echo "🔧 Management commands:"
echo "  - Check app status: pm2 status"
echo "  - Restart app: pm2 restart shumanbeans"
echo "  - View app logs: pm2 logs shumanbeans"
echo "  - Check nginx: systemctl status nginx"
