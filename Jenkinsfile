pipeline {
    agent any
    environment {
        WORKSPACE = '/var/jenkins_home/workspace/my-pipeline_main'
    }
    stages {
        stage('Checkout') {
            steps {
                dir("${WORKSPACE}") {
                    sh 'rm -rf * || true'
                    sh 'git clone https://github.com/ThetSu2Kyaw/mdb_vector_search.git .'
                }
            }
        }
    }
}
