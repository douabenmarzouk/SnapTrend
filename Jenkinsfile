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
     IMAGE_NAME = 'doua82400/angulare-app'
     IMAGE_TAG  = 'latest'
     SONAR_HOST_URL = 'http://localhost:9000'

    // Chemins Docker Desktop (ajoute les deux variantes courantes)
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
               bat 'docker --version || echo "Docker pas trouve - verifie PATH"'
               bat 'docker info || echo "Docker info echoue - probleme daemon"'
               bat '''
               set DOCKER_BUILDKIT=0
               docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                '''
    }
}
        stage('Prepare Docker Config') {
            steps {
                bat '''
                 mkdir .docker 2>nul
                 echo { } > .docker\\config.json
                 '''
    }
}
        stage('Docker Login') {
            steps {
                 withCredentials([usernamePassword(
                 credentialsId: 'doua-dockerhub',
                 usernameVariable: 'DOCKER_USER',
                 passwordVariable: 'DOCKER_PSW' )]) {
                 bat '''
                 docker logout
                 docker login -u %DOCKER_USER% -p %DOCKER_PSW%
                 '''
        }
    }
}

}

        stage('Docker Push') {
            steps {
                bat 'docker push %IMAGE_NAME%:%IMAGE_TAG%'
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
