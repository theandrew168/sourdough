#!/bin/sh
set -e

# Create sourdough group (if it doesn't exist)
if ! getent group sourdough >/dev/null; then
    groupadd --system sourdough
fi

# Create sourdough user (if it doesn't exist)
if ! getent passwd sourdough >/dev/null; then
    useradd                        \
        --system                   \
        --gid sourdough            \
        --shell /usr/sbin/nologin  \
        sourdough
fi

# Update config file permissions (idempotent)
chown root:sourdough /etc/sourdough.conf
chmod 0640 /etc/sourdough.conf

# Reload systemd to pickup services
systemctl daemon-reload

# Start or restart components
components="sourdough"
for component in $components; do
    if ! systemctl is-enabled $component >/dev/null
    then
        systemctl enable $component >/dev/null
        systemctl start $component >/dev/null
    else
        systemctl restart $component >/dev/null
    fi
done
