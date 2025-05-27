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
                script {
                    try {
                        sh '''
                            if command -v sudo >/dev/null 2>&1; then
                                # Use sudo if available
                                sudo docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            else
                                # Try without sudo
                                docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                            fi
                        '''
                    } catch (Exception e) {
                        echo "Error building Docker image: ${e.message}"
                        error "Docker build failed. Please check permissions and Docker daemon status."
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    try {
                        sh '''
                            if command -v sudo >/dev/null 2>&1; then
                                # Stop existing container if running (with sudo)
                                sudo docker ps -q --filter "name=${DOCKER_IMAGE}" | xargs -r sudo docker stop
                                sudo docker ps -aq --filter "name=${DOCKER_IMAGE}" | xargs -r sudo docker rm
                                
                                # Run new container
                                sudo docker run -d -p 8081:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}
                            else
                                # Without sudo
                                docker ps -q --filter "name=${DOCKER_IMAGE}" | xargs -r docker stop
                                docker ps -aq --filter "name=${DOCKER_IMAGE}" | xargs -r docker rm
                                
                                docker run -d -p 8081:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}
                            fi
                        '''
                    } catch (Exception e) {
                        echo "Error deploying container: ${e.message}"
                        error "Docker deployment failed. Please check permissions and container status."
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                try {
                    sh '''
                        if command -v sudo >/dev/null 2>&1; then
                            sudo docker system prune -f
                        else
                            docker system prune -f
                        fi
                    '''
                } catch (Exception e) {
                    echo "Warning: Could not clean up Docker resources: ${e.message}"
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Please check the logs for details.'
        }
    }
} 