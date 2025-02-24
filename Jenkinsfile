pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        PROJECT_DIR = '/home/jenkins/mdb_vector_search'  // Change this to your local project path
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm  // Checkout the latest code from the repository
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'which node'  // Verify node is installed
                sh 'node -v'  // Print the node version
                sh 'npm -v'  // Print the npm version
                sh 'npm install'  // Install the necessary node dependencies
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || echo "Linting errors found!"'  // Run linting, output errors if any
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'  // Run the tests for the application
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'  // Build the application if needed
            }
        }

        stage('Deploy (Local)') {
            steps {
                script {
                    // Stop any running instance (if applicable)
                    sh 'pkill -f "node server.js" || echo "No running process found"'

                    // Start the application
                    sh 'nohup npm start &'
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    def serverUp = sh(
                        script: 'curl --silent --fail http://localhost:3000 || echo "Server not running"',
                        returnStatus: true
                    )
                    if (serverUp != 0) {
                        error("Server failed to start on http://localhost:3000")
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Application started successfully on http://localhost:3000 🎉'
        }
        failure {
            echo 'Pipeline failed. Check logs for details. ❌'
        }
    }
}
