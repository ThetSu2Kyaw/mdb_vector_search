pipeline {
    agent {
        docker {
            image 'node:18' // Use Node.js with Git preinstalled
        }
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ThetSu2Kyaw/mdb_vector_search.git'
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
