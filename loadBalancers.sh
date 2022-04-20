#!/usr/bin/env bash

echo '*** COMPUTE ENGINE ***'

echo '> Creando VM 1...'
gcloud compute instances create app1 \
    --image-family debian-9 \
    --image-project debian-cloud \
    --tags webapp \
    --metadata startup-script="#! /bin/bash
        sudo apt-get update
        sudo apt-get install apache2 -y
        sudo service apache2 restart
        echo '<!doctype html><html><body><h1>App 1</h1></body></html>' | tee /var/www/html/index.html
    "

echo '> Creando VM 2...'
gcloud compute instances create app2 \
    --image-family debian-9 \
    --image-project debian-cloud \
    --tags webapp \
    --metadata startup-script="#! /bin/bash
        sudo apt-get update
        sudo apt-get install apache2 -y
        sudo service apache2 restart
        echo '<!doctype html><html><body><h1>App 2</h1></body></html>' | tee /var/www/html/index.html\
    "

echo '> Creando VM 3...'
gcloud compute instances create app3 \
    --image-family debian-9 \
    --image-project debian-cloud \
    --tags webapp \
    --metadata startup-script="#! /bin/bash
        sudo apt-get update
        sudo apt-get install apache2 -y
        sudo service apache2 restart
        echo '<!doctype html><html><body><h1>App 3</h1></body></html>' | tee /var/www/html/index.html\
    "

echo '> VMs creadas'
gcloud compute instances list

echo '> Creando regla INGRESS en el firewall -> Puerto 80...'
gcloud compute firewall-rules create www-firewall-network-lb \
    --target-tags webapp \
    --allow tcp:80

echo '*** NETWORK LOAD BALANCER ***'
echo '> Creando load balancer...'
gcloud compute addresses create loadbalancer-1

echo '> Agregando un health-check...'
gcloud compute http-health-checks create hc1

echo '> Creando un target pool con el health check'
gcloud compute target-pools create www-pool \
    --http-health-check hc1

echo '> Agregar las instancias al target pool'
gcloud compute target-pools add-instances www-pool \
    --instances app1,app2,app3

echo '> Agregando una regla de entrada'
gcloud compute forwarding-rules create www-rule \
    --ports 80 \
    --address loadbalancer-1 \
    --target-pool www-pool

echo '> Revisando la informacion del load balancer'
gcloud compute forwarding-rules describe www-rule

echo '*** HTTP LOAD BALANCER ***'

echo '> Crear una imagen/template de las instancias que necesitamos'
gcloud compute instance-templates create lb-backend-template \
    --tags=allow-health-check \
    --image-family=debian-9 \
    --image-project=debian-cloud \
    --metadata=startup-script='#! /bin/bash
     apt-get update
     apt-get install apache2 -y
     a2ensite default-ssl
     a2enmod ssl
     vm_hostname="$(curl -H "Metadata-Flavor:Google" \
     http://169.254.169.254/computeMetadata/v1/instance/name)"
     echo "Page served from: $vm_hostname" | \
     tee /var/www/html/index.html
     systemctl restart apache2'

echo '> Creando un grupo de instancias con la imagen que acabamos de hacer...'
gcloud compute instance-groups managed create lb-backend-group \
    --template=lb-backend-template \
    --size=6

echo '> Creando una regla en el firewall INGRESS'

gcloud compute firewall-rules create fw-allow-health-check \
    --network=default \
    --action=allow \
    --direction=ingress \
    --source-ranges=130.211.0.0/22,35.191.0.0/16 \
    --target-tags=allow-health-check \
    --rules=tcp:80

echo '> Asignar una IP estatica'
gcloud compute addresses create lb-ipv4-1 \
    --ip-version=IPV4 \
    --global

echo '> La IP asignada es'
gcloud compute addresses describe lb-ipv4-1 \
    --format="get(address)" \
    --global

echo '> Crear un healtcheck para el load balancer'
gcloud compute health-checks create http http-basic-check \
    --port 80

echo '> Crear un servicio de backend'
gcloud compute backend-services create web-backend-service \
    --protocol=HTTP \
    --port-name=http \
    --health-checks=http-basic-check \
    --global

echo '> Agregar el grupo de instancias al backend'
gcloud compute backend-services add-backend web-backend-service \
    --instance-group=lb-backend-group \
    --instance-group-zone=us-central1-a \
    --global

echo '> Vincular la ruta URL de las peticiones al servicio de backend'
gcloud compute url-maps create web-map-http \
    --default-service web-backend-service

echo '> Crear una regla global de redirección al proxy nuevo'
gcloud compute forwarding-rules create http-content-rule \
    --address=lb-ipv4-1\
    --global \
    --target-http-proxy=http-lb-proxy \
    --ports=80

echo '*** FIN ***'