pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'age-calculator'
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY = 'docker.io' // Replace with your registry if different
        DOCKER_CREDENTIALS = 'docker-credentials' // Configure these credentials in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    # Stop existing container if running
                    docker ps -q --filter "name=${DOCKER_IMAGE}" | xargs -r docker stop
                    docker ps -aq --filter "name=${DOCKER_IMAGE}" | xargs -r docker rm
                    
                    # Run new container
                    docker run -d -p 8081:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
            sh '''
                if command -v docker &> /dev/null; then
                    docker system prune -f
                fi
            '''
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Please check the logs for details.'
        }
    }
} 