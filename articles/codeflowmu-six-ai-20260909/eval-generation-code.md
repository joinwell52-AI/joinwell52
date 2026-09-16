# EVAL报告生成源码摘录

测试版本提交：`cb590ce35686cb1980e3c89a7d68bd0cfbeb825a`。以下连续片段由`git show`读取，保留原代码；仅摘取解释流程所需部分。源码说明机制，不单独证明某次运行成功。

## 01 / 启动记录报告的材料采集

这段代码启动任务记录采集程序，并将本次run_id传入。它负责组织运行材料；独立EVAL分析在后面启动。

```typescript
  const child = spawn(
    process.execPath,
    ["packages/evaluator/eval-benchmark-record.cjs", "--project-root", projectRoot, "--run-id", runId],
    { cwd: projectRoot, detached: true, stdio: "ignore" },
  );
```

来源：`codeflowmu-shell/src/eval-benchmark-recording.ts`，第592～596行，提交`cb590ce`。

## 02 / 为EVAL启动独立分析会话

系统先构建分析提示与技能注入，再把目标报告、分析类型和根任务绑定到EVAL会话。这里展示真正的会话启动调用；本次测试的EVAL配置统一为Cursor / auto-smart。

```typescript
      const handle = await runtime.sessionManager.startSession(
        agentId,
        sessionTaskId,
        {
          text: skillInjection.prompt,
          maxToolRounds: DEFAULT_SESSION_MAX_TOOL_ROUNDS,
          uiLang: readPanelUiLang(getProjectRoot()),
          context: {
            eval_observation: true,
            eval_analysis: true,
            analysis_kind: request.analysisKind,
            analysis_target_path: request.reportPath,
            root_task_id: request.mainTaskId,
            session_kind: "CHAT_BOUND",
          },
        },
      );
```

来源：`codeflowmu-shell/src/web-panel.ts`，第17863～17879行，提交`cb590ce`。

## 03 / 校验分析内容，未满足格式就返回错误

EVAL输出不会因会话结束就自动算成合格报告。写回函数先校验分析正文；完整函数还检查模型与会话来源、所需技能回执。因此“材料已有”和“分析报告完成”是两种状态。

```typescript
  const contentErrors = validateEvalAssistantText(content, input.analysisKind);
  if (contentErrors.length) {
    throw new Error(`EVAL_ANALYSIS_FORMAT_INVALID: ${contentErrors.join(",")}`);
  }
```

来源：`codeflowmu-shell/src/eval-independent-analysis.ts`，第286～289行，提交`cb590ce`。

## 04 / 将正文与分析运行证据写回文件

前面的代码将EVAL正文、通道、模型、Session、Run与技能信息加入报告。这四行是最后的落盘动作：先写UTF-8临时文件，再替换目标报告。最终可供后续核查的是保存下来的文件。

```typescript
  const temporary = `${absolute}.analysis-${process.pid}-${Date.now()}.tmp`;
  writeFileSync(temporary, raw, "utf8");
  renameSync(temporary, absolute);
  return absolute;
```

来源：`codeflowmu-shell/src/eval-independent-analysis.ts`，第393～396行，提交`cb590ce`。

