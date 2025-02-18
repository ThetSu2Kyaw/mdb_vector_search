pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        REMOTE_SERVER = 'root@167.99.79.177'
        REMOTE_DIR = '/root/mdb_vector_search'
        SSH_KEY_PATH = '/root/.ssh/id_rsa'  // path to private key
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
                script {
                    // Use ssh key instead of sshpass
                    sh """
                        echo "Deploying application to remote server..."

                        # SSH into the remote server and execute commands
                        ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} << 'EOF'
                            # Ensure pm2 is installed
                            which pm2 || npm install -g pm2

                            cd ${REMOTE_DIR} || { echo "Failed to cd to ${REMOTE_DIR}"; exit 1; }

                            # Stash any local changes before pulling
                            git stash || { echo "Git stash failed"; exit 1; }

                            # Pull the latest changes from the main branch
                            git pull origin main || { echo "Git pull failed"; exit 1; }

                            # Install dependencies after pulling
                            npm install || { echo "npm install failed"; exit 1; }

                            # Restart or start the application with pm2
                            pm2 restart app || pm2 start npm --name "mdb_vector_search" -- run start || { echo "pm2 start failed"; exit 1; }
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
