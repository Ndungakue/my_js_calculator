pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'age-calculator'
        DOCKER_TAG = 'latest'
        DOCKER_REGISTRY = 'docker.io' // Replace with your registry if different
        DOCKER_CREDENTIALS = 'docker-credentials' // Configure these credentials in Jenkins
    }

    tools {
        nodejs 'nodejs-24'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            agent any
            steps {
                nodejs(nodeJSInstallationName: 'nodejs-24') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            agent any
            steps {
                nodejs(nodeJSInstallationName: 'nodejs-24') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit '**/test-results/*.xml'
                }
            }
        }

        stage('Build Docker Image') {
            agent any
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        def customImage = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        customImage.push()
                    }
                }
            }
        }

        stage('Deploy') {
            agent any
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
        always {
            node('any') {
                // Clean up old images to save space
                sh 'docker system prune -f'
            }
        }
        success {
            node('any') {
                echo 'Pipeline completed successfully!'
            }
        }
        failure {
            node('any') {
                echo 'Pipeline failed! Please check the logs for details.'
            }
        }
    }
} 