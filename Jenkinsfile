pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'age-calculator'
        DOCKER_TAG = 'latest'
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
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
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
                        // Stop and remove existing container if it exists
                        sh '''
                            docker ps -q -f name=${DOCKER_IMAGE} && docker stop ${DOCKER_IMAGE} || true
                            docker ps -a -q -f name=${DOCKER_IMAGE} && docker rm ${DOCKER_IMAGE} || true
                        '''
                        
                        // Run new container
                        sh "docker run -d -p 8082:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
                    sh "docker system prune -f"
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