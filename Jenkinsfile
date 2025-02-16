pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
		sh 'which node'
		sh 'node -v'
		sh 'npm -v'
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || echo "Linting errors found!"'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'echo "Deploying application..."'
                // Example: Restart app with PM2
                sh 'pm2 restart app || pm2 start npm --name "express-app" -- run start'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}

