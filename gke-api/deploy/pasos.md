```bash
# Hacer el deployment
gcloud deployment-manager deployments create test-deployment --config deployment.yaml

# instalar los paquetes

# Instalar el agente de monitoreo
curl -sSO https://dl.google.com/cloudagents/install-monitoring-agent.sh
sudo bash install-monitoring-agent.sh

# Instalar el agente de logging
curl -sSO https://dl.google.com/cloudagents/install-logging-agent.sh
sudo bash install-logging-agent.sh
```