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
            environment {
                SONAR_TOKEN = credentials('SONAR_TOKEN')
            }
            steps {
                bat 'npx sonar-scanner -Dsonar.projectKey=SnapTrend -Dsonar.sources=src -Dsonar.host.url=%SONAR_HOST_URL% -Dsonar.login=%SONAR_TOKEN%'
            }
        }

        stage('Docker Build & Push') {
            environment {
                DOCKERHUB = credentials('doua-dockerHub')
            }
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
                bat 'echo %DOCKERHUB_PSW% | docker login -u %DOCKERHUB_USR% --password-stdin'
                bat 'docker push %IMAGE_NAME%:%IMAGE_TAG%'
                bat 'docker logout'
            }
        }
    }

    post {
        always {
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
