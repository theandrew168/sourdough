#!/bin/sh
set -e

# Create webgl group (if it doesn't exist)
if ! getent group webgl >/dev/null; then
    groupadd --system webgl
fi

# Create webgl user (if it doesn't exist)
if ! getent passwd webgl >/dev/null; then
    useradd                        \
        --system                   \
        --gid webgl                \
        --shell /usr/sbin/nologin  \
        webgl
fi

# Update config file permissions (idempotent)
chown root:webgl /etc/webgl.conf
chmod 0640 /etc/webgl.conf

# Reload systemd to pickup webgl.service
systemctl daemon-reload

# Start or restart dripfile components
components="webgl"
for component in $components; do
    if ! systemctl is-enabled $component >/dev/null
    then
        systemctl enable $component >/dev/null
        systemctl start $component >/dev/null
    else
        systemctl restart $component >/dev/null
    fi
done
