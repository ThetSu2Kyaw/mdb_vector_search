pipeline {
    agent any
    stages {
        stage('Cleanup') {
            steps {
                deleteDir() // Properly cleans the workspace
            }
        }
        stage('Checkout') {
            steps {
                sh 'git clone https://github.com/ThetSu2Kyaw/mdb_vector_search.git .'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
    }
}
