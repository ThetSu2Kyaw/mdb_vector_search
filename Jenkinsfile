pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        REMOTE_SERVER = 'root@167.99.79.177' 
        REMOTE_DIR = '/root/mdb_vector_search' 
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
                sshagent(credentials: ['digital ocean']) {
                    sh """
                        echo "Deploying application to remote server..."
                        ssh ${REMOTE_SERVER} <<EOF
                            cd ${REMOTE_DIR} || exit
                            git pull origin main || exit
                            npm install || exit
                            pm2 restart app || pm2 start npm --name "mdb_vector_search" -- run start || exit
                        EOF
                    """
                }
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


