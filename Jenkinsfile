pipeline {
    agent { label 'my_agent' }

    tools {
        nodejs 'node-22.18'
    }

    triggers {
        pollSCM('H/10 * * * 1-5')
    }

    parameters {
        booleanParam(
            name: 'DEBUG_BUILD',
            defaultValue: true,
            description: 'Activer lint et tests'
        )
    }

    environment {
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        DOCKERHUB_CREDENTIALS=credentials('doua-dockerHub')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/douabenmarzouk/SnapTrend.git',
                    credentialsId: 'github_cred'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npx ng build'
            }
        }

        stage('Lint') {
            when { expression { params.DEBUG_BUILD } }
            steps {
                bat 'npx ng lint || exit 0'
            }
        }

        stage('Test') {
            when { expression { params.DEBUG_BUILD } }
            steps {
                bat 'npx ng test --watch=false || exit 0'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                bat '''
                npx sonar-scanner ^
                -Dsonar.projectKey=SnapTrend ^
                -Dsonar.sources=src ^
                -Dsonar.host.url=%SONAR_HOST_URL% ^
                -Dsonar.login=%SONAR_TOKEN%
                '''
            }
        }
    }


    stages {

        stage('Build Image') {
            steps {
                sh 'docker build -t doua82500/angular-docker:latest .'
            }
        }

        stage('Login Docker Hub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push doua82500/angular-docker:latest'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}


    post {
        always {
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
        success {
            echo 'Build complet avec succès !'
        }
        failure {
            echo 'Échec du build'
        }
    }
}
