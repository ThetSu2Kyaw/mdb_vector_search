pipeline {
    agent any
    stages {
        stage('Cleanup') {
            steps {
                sh 'rm -rf * || true'
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
