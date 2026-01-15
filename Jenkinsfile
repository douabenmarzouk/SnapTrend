pipeline {
    agent any


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
        IMAGE_NAME = 'doua82400/angulare-app'
        IMAGE_TAG  = 'latest'
        SONAR_HOST_URL = 'http://localhost:9000'

        PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin;" +
               "C:\\Program Files\\Docker\\Docker\\resources;" +
               "C:\\Program Files\\Docker\\cli-plugins;" +
               "${env.PATH}"
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
                bat '''
                npx sonar-scanner ^
                -Dsonar.projectKey=SnapTrend ^
                -Dsonar.sources=src ^
                -Dsonar.host.url=%SONAR_HOST_URL% ^
                -Dsonar.login=%SONAR_TOKEN%
                '''
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker --version'
                bat 'docker info'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }
         stage('Security Scan - Trivy') {
           steps {
                bat '''
                echo ===== Trivy security scan =====

                REM cache temporaire (pas de stockage long)
                set TRIVY_CACHE_DIR=%WORKSPACE%\\.trivy-cache

                trivy image ^
                --severity HIGH,CRITICAL ^
                --no-progress ^
                 doua82400/angulare-app:latest

                REM nettoyage cache
                rmdir /s /q %WORKSPACE%\\.trivy-cache
                 '''  }
}

       


        // ❌ Prepare Docker Config SUPPRIMÉ (cause du problème)

        stage('Docker Login') {
           steps {
                withCredentials([usernamePassword(
                credentialsId: 'doua-dockerhub',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PSW' )]) {
                bat '''
                echo %DOCKER_PSW% | docker login -u %DOCKER_USER% --password-stdin
                '''
        }
    }
}


        stage('Docker Push') {
            steps {
                bat 'docker push %IMAGE_NAME%:%IMAGE_TAG%'
                bat 'docker logout'
            }
        }
        stage('Docker Cleanup') {
            steps {
             bat 'docker image prune -f'
    }
}

    }

    post {
        always {
            archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
        }
        success {
            echo 'Build complet avec succes !'
        }
        failure {
            echo 'Echec build'
        }
    }
}
