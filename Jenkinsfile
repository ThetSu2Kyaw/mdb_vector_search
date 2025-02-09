pipeline {
    agent any
    stages {
        stage("build") {
            steps {
                echo 'building the application...'
                echo 'second time building...'
            }
        }

        stage("test") {
            steps {
                echo 'testing the application...'
            }
        }

        stage("deploy") {
            steps {
                echo 'deploying the application...'
            }
        }
    }
}
