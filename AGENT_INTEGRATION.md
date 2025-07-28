# Z-Agent Framework Integration

This document describes the integration of the z-agent framework functionality into the Aiency application.

## Overview

The z-agent framework integration enhances the existing Aiency application with the ability to create, manage, and execute AI agents using the z-agent framework. It includes:

- **Agent Creation**: UI for creating new agents with tool selection and task definition
- **Agent Management**: Enhanced dashboard for viewing and organizing both monitoring agents and framework agents
- **Agent Execution**: Interface for running agents with custom arguments and real-time status updates
- **Observability**: Helicone integration for monitoring and analytics
- **Performance Dashboard**: Metrics and execution history tracking

## Architecture

### Components

```
src/
├── components/
│   ├── AgentCreator.jsx       # Agent creation form with tool selection
│   └── AgentExecutor.jsx      # Agent execution interface with real-time status
├── pages/
│   └── Agents.jsx             # Enhanced main agents page with tabs
├── context/
│   └── AgentContext.jsx       # React context for z-agent framework state
├── services/
│   ├── agentApi.js           # Z-agent framework API client
│   └── heliconeClient.js     # Helicone observability client
├── hooks/
│   └── useAgentObservability.js # Custom hook for observability features
└── utils/
    └── apiClient.js          # Generic HTTP client utility
```

### Integration Points

The integration seamlessly extends the existing Aiency application:

1. **Enhanced Agents Page**: The existing `/agents` route now includes tabbed interface:
   - **Performance Monitoring**: Original agent monitoring functionality
   - **Z-Agent Framework**: New framework agent management
   - **Create Agent**: Agent creation interface
   - **Execute Agent**: Agent execution interface
   - **Analytics**: Observability dashboard (when Helicone is configured)

2. **State Management**: New `AgentContext` provides z-agent framework state alongside existing `AppContext`

3. **API Integration**: Communicates with z-agent framework through these endpoints:
   - `GET /tool_search?query={query}` - Search for available tools
   - `GET /agent_search?query={query}` - Search for existing agents
   - `POST /save_agent` - Create a new agent
   - `POST /agent_call` - Execute an agent

## Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Z-Agent Framework Configuration
VITE_AGENT_API_URL=http://localhost:8000

# Helicone Observability Configuration
VITE_HELICONE_API_KEY=your_helicone_api_key_here
VITE_HELICONE_API_URL=https://api.helicone.ai

# Optional: Additional API Keys for Agent Tools
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_SERPER_API_KEY=your_serper_api_key_here
```

### 2. Z-Agent Framework Backend

Ensure the z-agent framework backend is running:

```bash
# Clone the framework
git clone https://github.com/z-agent/framework.git
cd framework

# Install dependencies
python3 -m venv ./env
source ./env/bin/activate
pip install -r requirements.txt

# Set environment variables
export OPENAI_API_KEY=your_openai_api_key
export SERPER_API_KEY=your_serper_api_key

# Run the server
python3 -m src.server.main
```

The server will be available at `http://localhost:8000`.

### 3. Helicone Setup (Optional)

1. Sign up at [helicone.ai](https://helicone.ai)
2. Get your API key from the dashboard
3. Add it to your `.env` file as `VITE_HELICONE_API_KEY`

## Features

### Enhanced Agent Management

The Agents page now includes multiple tabs:

#### Performance Monitoring Tab
- **Original Functionality**: Existing agent monitoring and performance tracking
- **Agent Cards**: View accuracy, response time, and resource utilization
- **Performance Charts**: Accuracy and response time trends
- **Activity Logs**: Recent agent activity and status changes

#### Z-Agent Framework Tab
- **Framework Agents**: View agents created with the z-agent framework
- **Agent Details**: Expandable cards showing tools, tasks, and metadata
- **Quick Actions**: Execute agents directly from the management interface
- **Search & Filter**: Find agents by name or description

#### Create Agent Tab
- **Interactive Form**: Step-by-step agent creation process
- **Tool Selection**: Search and select from available z-agent framework tools
- **Task Definition**: Define multiple tasks for the agent
- **Validation**: Client-side validation with helpful error messages

#### Execute Agent Tab
- **Agent Selection**: Choose from available framework agents
- **Argument Configuration**: Set execution parameters and context
- **Real-time Status**: Live execution status and progress tracking
- **Results Display**: Formatted execution results with metadata
- **Execution History**: Track recent executions and their outcomes

#### Analytics Tab (Helicone Required)
- **System Metrics**: Overall execution statistics and performance
- **Success Rates**: Track agent execution success and failure rates
- **Cost Monitoring**: Token usage and cost tracking
- **Observability Status**: Configuration status and health checks

### Agent Creation Workflow

1. Navigate to Agents → Create Agent tab
2. Fill in basic information:
   - **Agent Name**: Unique identifier
   - **Description**: What the agent does
   - **Tasks**: List of tasks the agent will perform
3. Select tools:
   - Search available tools from the z-agent framework
   - View tool descriptions and parameters
   - Select multiple tools for the agent
4. Save the agent to the framework

### Agent Execution Workflow

1. Navigate to Agents → Execute Agent tab
2. Select an agent from the list
3. Configure execution arguments:
   - **Task Description**: What you want the agent to do
   - **Additional Context**: Any constraints or additional information
   - **Custom Arguments**: JSON-formatted custom parameters
4. Execute the agent and view real-time results

### Observability & Analytics

When Helicone is configured:

- **Execution Tracking**: All agent executions are logged with metadata
- **Performance Metrics**: Success rates, execution times, and costs
- **Error Logging**: Detailed error tracking and debugging information
- **System Health**: Overall system performance and status monitoring

## Technical Implementation

### State Management

The integration uses React Context for state management:

```javascript
// AgentContext provides:
const {
  // Framework agents (separate from monitoring agents)
  frameworkAgents,
  tools,
  currentAgent,
  executionResults,
  
  // UI state
  loading,
  errors,
  activeExecutions,
  executionHistory,
  
  // Actions
  loadFrameworkAgents,
  loadTools,
  searchTools,
  saveAgent,
  executeAgent,
  
  // Utilities
  isApiAvailable,
  isHeliconeEnabled
} = useAgent();
```

### API Integration

The `agentApi` service handles all z-agent framework communication:

```javascript
// Search for tools
const tools = await agentApi.searchTools('web search');

// Create an agent
const agent = await agentApi.saveAgent({
  name: 'Research Assistant',
  description: 'Helps with research tasks',
  tasks: ['Search web', 'Summarize findings'],
  tools: [webSearchTool, summarizerTool]
});

// Execute an agent
const result = await agentApi.executeAgent(agent.id, {
  task: 'Research AI trends in 2024',
  context: 'Focus on enterprise applications'
});
```

### Observability Integration

The `heliconeClient` provides comprehensive observability:

```javascript
// Log execution start
const session = await heliconeClient.logExecutionStart({
  agent_id: 'agent_123',
  agent_name: 'Research Assistant',
  arguments: { task: 'Research AI trends' }
});

// Log execution completion
await heliconeClient.logExecutionComplete({
  session_id: session.session_id,
  result: 'Research completed successfully',
  execution_time: 5000,
  tokens_used: 1500,
  cost: 0.05
});

// Get metrics
const metrics = await heliconeClient.getSystemMetrics('24h');
```

## Error Handling

The integration includes comprehensive error handling:

- **Network Errors**: Graceful fallback to mock data for development
- **API Unavailable**: Clear messaging when z-agent framework is not accessible
- **Validation Errors**: Client-side validation with user-friendly messages
- **Execution Errors**: Detailed error logging and user feedback
- **Helicone Errors**: Graceful degradation when observability is unavailable

## Development Features

### Mock Data Support

When the z-agent framework API is unavailable, the integration provides mock data:

- **Mock Tools**: Predefined set of common tools (web search, file reader, calculator, etc.)
- **Mock Agents**: Sample agents for testing and development
- **Mock Execution**: Simulated execution results for UI testing

### Graceful Degradation

- **API Unavailable**: Application continues to work with existing monitoring features
- **Helicone Disabled**: Analytics tab is hidden, but core functionality remains
- **Network Issues**: Automatic retry with exponential backoff
- **Invalid Responses**: Fallback to cached or mock data

## Security Considerations

- **API Keys**: Stored in environment variables, never exposed in client code
- **Input Validation**: All user inputs are validated before API calls
- **Error Handling**: Errors don't expose sensitive system information
- **CORS Configuration**: Proper cross-origin request handling

## Performance Optimizations

- **Debounced Search**: Tool and agent searches are debounced to reduce API calls
- **State Caching**: Agent and tool data is cached in React state
- **Lazy Loading**: Components are loaded on demand
- **Pagination**: Large datasets are paginated for better performance

## Future Enhancements

Potential improvements:

- **Batch Execution**: Execute multiple agents simultaneously
- **Agent Templates**: Pre-configured agent templates for common use cases
- **Custom Tools**: Upload and register custom tools
- **Workflow Builder**: Visual agent workflow creation
- **Real-time Collaboration**: Multi-user agent development
- **Version Control**: Agent versioning and rollback capabilities
- **A/B Testing**: Compare agent performance variations

## Troubleshooting

### Common Issues

1. **Z-Agent Framework Not Available**
   - Check if the backend is running on the configured URL
   - Verify `VITE_AGENT_API_URL` in environment variables
   - Check network connectivity and CORS configuration

2. **Helicone Not Working**
   - Verify `VITE_HELICONE_API_KEY` is set correctly
   - Check Helicone service status
   - Review browser console for authentication errors

3. **Agent Creation Fails**
   - Ensure at least one tool is selected
   - Check that all required fields are filled
   - Verify z-agent framework backend is accessible

4. **Agent Execution Fails**
   - Check agent configuration and selected tools
   - Verify execution arguments are properly formatted
   - Review execution logs for detailed error information

### Debug Mode

Enable debug mode by setting:

```bash
VITE_DEBUG=true
```

This will:
- Enable detailed console logging
- Show additional debug information in the UI
- Display mock data indicators
- Provide detailed error messages

## Contributing

When contributing to the agent integration:

1. Follow existing code patterns and component structure
2. Add proper error handling and validation
3. Include comprehensive documentation
4. Test with both real and mock data
5. Consider accessibility and mobile responsiveness
6. Maintain backward compatibility with existing features

## License

This integration follows the same license as the main Aiency application.
