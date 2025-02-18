pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        REMOTE_SERVER = 'root@167.99.79.177'
        REMOTE_DIR = '/root/mdb_vector_search'
        SSH_KEY_PATH = '/home/jenkins/.ssh/id_rsa'  // Path for Jenkins user SSH key
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
                        ssh-add /home/jenkins/.ssh/id_rsa  // Use the Jenkins user's private SSH key
                    '''

                    // Deploy the application to the remote server using separate SSH commands
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'which pm2 || npm install -g pm2'"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'cd ${REMOTE_DIR} || { echo \"Failed to cd to ${REMOTE_DIR}\"; exit 1; }'"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'git stash || { echo \"Git stash failed\"; exit 1; }'"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'git pull origin main || { echo \"Git pull failed\"; exit 1; }'"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'npm install || { echo \"npm install failed\"; exit 1; }'"
                    sh "ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} 'pm2 restart app || pm2 start npm --name \"mdb_vector_search\" -- run start || { echo \"pm2 start failed\"; exit 1; }'"
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
