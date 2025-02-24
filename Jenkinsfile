pipeline {
    agent any

    environment {
        NODE_VERSION = '18' // Set your preferred Node.js version
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/ThetSu2Kyaw/mdb_vector_search.git' // Replace with your repo URL
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    def nodeInstalled = sh(script: 'node -v', returnStatus: true) == 0
                    if (!nodeInstalled) {
                        error "Node.js is not installed on this Jenkins agent!"
                    }
                }
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test' // Make sure your package.json has a test script
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build' // Modify this if you need a specific build step
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy step (Modify as needed)' 
                // Example: sh 'pm2 restart your-app'
            }
        }
    }

    post {
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
