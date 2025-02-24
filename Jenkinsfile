pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    sh 'rm -rf mdb_vector_search || true' // Cleanup
                    sh 'git clone https://github.com/ThetSu2Kyaw/mdb_vector_search.git'
                    sh 'cd mdb_vector_search && git checkout main'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'cd mdb_vector_search && npm install'
            }
        }
    }
}
