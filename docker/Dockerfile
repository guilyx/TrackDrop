FROM node:18-alpine

LABEL maintainer="Soma Gallai <gallaisoma@gmail.com>"
LABEL maintainer2="Erwin Lejeune <erwin.lejeune15@gmail.com>"

WORKDIR /app

COPY package.json /.
COPY docker/entrypoint.sh /. 
COPY tsconfig.json /. 
COPY tsconfig.node.json /.
COPY vite.config.ts /.
COPY index.html /.
COPY src/ /.

RUN npm install
RUN npm run build
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]