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
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Test') {
            steps {
                // Add test steps here when you have tests
                echo 'Tests will be added in future updates'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop existing container if running
                    sh 'docker ps -q --filter "name=${DOCKER_IMAGE}" | xargs -r docker stop'
                    sh 'docker ps -aq --filter "name=${DOCKER_IMAGE}" | xargs -r docker rm'
                    
                    // Run new container
                    sh "docker run -d -p 8080:80 --name ${DOCKER_IMAGE} ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Please check the logs for details.'
        }
        always {
            // Clean up old images to save space
            sh 'docker system prune -f'
        }
    }
} 