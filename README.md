# Video Dubbing System

A comprehensive video dubbing system with SRT processing, text-to-speech conversion, and multi-step workflow management.

## Features

✅ **SRT File Processing** - Parse and validate SRT subtitle files
✅ **Text-to-Speech** - Convert subtitle text to audio
✅ **Multi-Step Workflow** - Extract → Generate → Mix pipeline
✅ **Queue Management** - Redis-based asynchronous processing
✅ **Real-time Status** - Track workflow progress
✅ **REST API** - Complete API endpoints
✅ **Docker Support** - Containerized deployment
✅ **Comprehensive Tests** - Unit and integration testing

## Quick Start

### Prerequisites

- Node.js 18+ 
- Redis Server
- Docker & Docker Compose (optional)

### Installation

Clone repository

git clone https://github.com/sayad-dot/Video-Dubbing-System.git

cd Video-Dubbing-System

Install dependencies

npm install

Set up environment

cp .env.example .env

Start Redis server

redis-server

Start application

npm run dev


### Docker Deployment

Build and start with Docker Compose

docker-compose up -d

View logs

docker-compose logs -f

Stop services

docker-compose down



## API Endpoints

### SRT Processing

- `POST /api/srt/upload` - Upload SRT file

- `GET /api/srt/voices` - Get available voices

- `GET /api/srt/download/:filename` - Download audio

### Workflow Management

- `POST /api/workflow` - Start workflow


- `GET /api/workflow/:jobId/status` - Check status

- `GET /api/workflow/:jobId/result` - Get result

### Health Check

- `GET /health` - System health

- `GET /api/health` - API health

## Testing

Run all tests

npm test

Run with coverage

npm run test:coverage

Run specific test types

npm run test:unit

npm run test:integration



## Production Deployment

Build production image

npm run production:build

Deploy to production

npm run production:deploy



## Architecture

The system follows a microservices architecture with:

1. **Express.js API** - RESTful endpoints

2. **Redis Queue** - Asynchronous job processing

3. **Multi-step Workers** - Extract, Generate, Mix

4. **File Storage** - Temporary and processed files

5. **Docker Containers** - Isolated services

## License

MIT License - See LICENSE file for details