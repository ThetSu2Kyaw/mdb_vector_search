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
                sshagent(credentials: ['digital-ocean']) {
                    sh """
                        echo "Deploying application to remote server..."
                        # Add debugging for SSH connection
                        ssh -v ${REMOTE_SERVER} 'echo "SSH connection successful!"'

                        # Deploy commands
                        ssh ${REMOTE_SERVER} << 'EOF'
                            # Ensure pm2 is installed
                            which pm2 || npm install -g pm2
                            
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
