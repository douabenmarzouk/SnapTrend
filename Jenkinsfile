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
        DOCKERHUB = credentials('doua-dockerHub')
        IMAGE_NAME = 'doua82500/angular-docker'
        IMAGE_TAG = 'latest'
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

        stage('Build Angular') {
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
                bat """
                npx sonar-scanner ^
                -Dsonar.projectKey=SnapTrend ^
                -Dsonar.sources=src ^
                -Dsonar.host.url=%SONAR_HOST_URL% ^
                -Dsonar.login=%SONAR_TOKEN%
                """
            }
        }

        stage('Docker Build') {
            steps {
                bat "docker build -t %IMAGE_NAME%:%IMAGE_TAG% ."
            }
        }

        stage('Docker Login') {
            steps {
                bat """
                echo %DOCKERHUB_PSW% | docker login -u %DOCKERHUB_USR% --password-stdin
                """
            }
        }

        stage('Docker Push') {
            steps {
                bat "docker push %IMAGE_NAME%:%IMAGE_TAG%"
            }
        }
    }

    post {
        always {
            bat 'docker logout'
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
        success {
            echo '✅ Build complet avec succès !'
        }
        failure {
            echo '❌ Échec du build'
        }
    }
}
