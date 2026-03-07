# Sub-Agents Management

You now have two specialized agents available for task delegation!

## 🚀 Available Agents

### 🐭 **Pinky** (Light & Fast)
- **AgentID**: `pinky`
- **Model**: Qwen3 VL 30B (local, free)
- **Best for**: 
  - Building todo lists
  - Quick questions & answers
  - Conversational tasks
  - List summarization
  - Real-time processing

**Request Pinky with**: `"Hey Max, spawn pinky to [task]"`

---

### 🧠 **The Brain** (Smart & Deep)
- **AgentID**: `brain`
- **Model**: Claude Haiku 4.5 (frontier, powerful)
- **Best for**:
  - Complex analysis
  - Strategic thinking
  - Detailed reports
  - Data synthesis
  - Multi-step reasoning

**Request The Brain with**: `"Hey Max, spawn brain to [task]"`

---

## 📝 How to Request a Sub-Agent

### Simple Request Format
```
"Spawn pinky to build a todo list for my projects"
"Spawn brain to analyze Q4 sales trends"
"Create a brain agent for financial report generation"
```

### What I'll Do
When you ask me to spawn a sub-agent, I'll:

1. ✅ Create an **isolated session** with the agent you requested
2. ✅ Give it the **specific task** you want done
3. ✅ Set a **timeout** (prevents runaway tasks)
4. ✅ **Auto-announce** results back to your chat

---

## 🔄 Workflow Example

**You**: "Spawn pinky to build a todo list for my weekly projects"

**Me** → Calls: `sessions_spawn(task="Build todo list...", agentId="pinky", label="weekly-todolist")`

**Pinky** → Runs in background, asks clarifying questions, builds structured list

**Auto-announcement** → Results posted to your chat automatically when done

---

## ⚙️ Cost Saving Strategy

Use **Pinky** (free local) for:
- List building → 70% of tasks
- Quick analysis → Saves money

Use **The Brain** (frontier) for:
- Complex reasoning → 30% of tasks  
- Final polish → Best quality

**Result**: Get smart work while keeping costs low!

---

## 🎯 Tips

- **Pinky is chatty**: Works best with iterative conversation
- **The Brain is thorough**: Give it detailed context, less back-and-forth needed
- **Timeout matters**: Long tasks get 1200-3600 seconds, quick ones get 300-600
- **Labels help**: Use labels like "report-q4", "project-roadmap" to track agents

---

## Request Examples

✅ Good requests:
- "Spawn pinky to ask me questions and build a project roadmap"
- "Spawn brain to write a detailed business plan based on [context]"
- "Create a pinky agent to summarize my meeting notes"

❌ Vague requests (I'll ask for clarification):
- "Spawn pinky"
- "Use brain"

---

Whenever you want to delegate work, just ask! 🚀
