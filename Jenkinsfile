pipeline {
    agent any
    stages {
        stage("build") {
            steps {
                echo 'Hello Jenkins'
            }
        }

        stage("test") {
            steps {
                sh 'echo "testing the application..."'
            }
        }

        stage("deploy") {
            steps {
               sh 'echo "deploying the application..."'
            }
        }
    }
}
