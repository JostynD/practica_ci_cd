pipeline {
    agent any

    environment {
        IMAGE_NAME = "simple-deploy-demo"
        CONTAINER_NAME = "simple-deploy-demo-container"
        APP_PORT = "3000"
        HOST_PORT = "3000"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER -t $IMAGE_NAME:latest .'
            }
        }

        stage('Stop Previous Container') {
            steps {
                sh '''
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Deploy New Container') {
            steps {
                sh '''
                    docker run -d \
                      --name $CONTAINER_NAME \
                      -p $HOST_PORT:$APP_PORT \
                      $IMAGE_NAME:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'sleep 3 && curl -sf http://localhost:$HOST_PORT || (echo "El despliegue no respondio" && exit 1)'
            }
        }
    }

    post {
        success {
            echo "Despliegue exitoso: build #${BUILD_NUMBER}"
        }
        failure {
            echo "El pipeline fallo, revisar logs"
        }
    }
}
