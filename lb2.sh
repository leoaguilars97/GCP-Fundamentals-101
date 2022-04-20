echo '> Creando VM 1...'
gcloud compute instances create app1 \
    --image-family debian-9 \
    --image-project debian-cloud \
    --tags webapp \
    --metadata startup-script="#! /bin/bash
        sudo apt-get update
        sudo apt-get install apache2 -y
        sudo service apache2 restart
        echo '<!doctype html><html><body><h1>App 1</h1></body></html>' | tee 
/var/www/html/index.html
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
        echo '<!doctype html><html><body><h1>App 2</h1></body></html>' | tee 
/var/www/html/index.html\
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
        echo '<!doctype html><html><body><h1>App 3</h1></body></html>' | tee 
/var/www/html/index.html\
    "
