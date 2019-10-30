FROM node:10

ARG USER=docker

WORKDIR /initialize

RUN apt-get update && \
      apt-get -y install sudo

RUN adduser --disabled-password --gecos '' ${USER}
RUN adduser ${USER} sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER ${USER} 

RUN sudo apt-get update && sudo apt-get install -y apt-transport-https && \
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add - && \
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list && \
sudo apt-get update && \
sudo apt-get install -y kubectl && \
sudo curl -LO https://git.io/get_helm.sh && \
sudo chmod 700 get_helm.sh && \
sudo ./get_helm.sh && \
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp && \
sudo mv /tmp/eksctl /usr/local/bin && \
sudo apt-get install -y python3 python3-pip python3-setuptools groff less && \
pip3 install --upgrade pip && \
sudo apt-get clean && \
sudo pip3 --no-cache-dir install --upgrade awscli

WORKDIR /home/${USER}/app
RUN sudo chown -R ${USER} /home/${USER}
RUN mkdir /home/${USER}/.aws

############################
##### Install NODE app #####
############################

COPY src .
COPY package.json .
RUN npm i

# ENV AWS_ACCESS_KEY=
# ENV AWS_SECRET_KEY=
# ENV AWS_REGION=
ENV HELM_CHART_PATH=/home/${USER}/chart


CMD node app.js