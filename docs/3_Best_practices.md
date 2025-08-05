# Best Practices

> [!IMPORTANT]
> This document is still in early development stage.

## Manage Cobalt Strike with Services

These scripts can be used as a template to set up teamserver as a service.

These scripts have been tested on ```Ubuntu``` server, and will need to be adjusted based on your use case.

### Configuration Steps

1. Update the service files to match your environment.
    - ```teamserver.service```
2. Copy the service files to your teamserver
    - ```/etc/systemd/system/teamserver.service```
3. Register the new services
    ```bash
    systemctl daemon-reload
    ```
4. Start the services
    ```bash
    systemctl start teamserver.service
    ```

### Team Server Service

Update the settings to match your environment.

- ```WorkingDirectory```: set to the cobaltstrike directory
- ```ExecStart```: Set with your values

```bash
# teamserver.service

[Unit]
Description=Cobalt Strike Teamserver Service
After=network.target
Wants=network.target

[Service]
Type=Simple
WorkingDirectory=<PATH TO COBALT STRIKE>/cobaltstrike/server
ExecStart=<PATH TO COBALT STRIKE>/cobaltstrike/server/teamserver <TEAM SERVER IP> <TEAM SERVER PASSWORD> <PATH TO C2 PROFILE>

[Install]
WantedBy=multi-user.target
```