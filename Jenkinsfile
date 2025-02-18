pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        REMOTE_SERVER = 'root@167.99.79.177'
        REMOTE_DIR = '/root/mdb_vector_search'
        SSH_KEY_PATH = '/home/jenkins/.ssh/id_rsa'  // Updated path for Jenkins user
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

        stage('Deploy') {
            steps {
                script {
                    // Ensure SSH agent is running and key is loaded for secure connections
                    sh '''
                        eval $(ssh-agent -s)
                        ssh-add ${SSH_KEY_PATH}
                    '''
            
                    // Deploy the application to the remote server
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} '
                            if [ ! -d ${REMOTE_DIR}/.git ]; then
                                echo "Cloning repository..."
                                rm -rf ${REMOTE_DIR}
                                git clone https://github.com/ThetSu2Kyaw/mdb_vector_search.git ${REMOTE_DIR}
                            fi
                        '
                    """
        
                    // Ensure pm2 is installed and the app is running
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'which pm2 || npm install -g pm2'"
        
                    // Pull the latest changes if repository exists
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'cd ${REMOTE_DIR} && git pull origin main'"
        
                    // Install dependencies
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'cd ${REMOTE_DIR} && npm install'"
        
                    // Start or restart the application with pm2
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'cd ${REMOTE_DIR} && pm2 restart app || pm2 start npm --name \"mdb_vector_search\" -- run start'"
                }
            }
        }

    }

    post {
        success {
            echo 'Deployment successful!'  // Success message after deployment
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'  // Failure message if the pipeline fails
        }
    }
}
