
# Codex Code Review Rules

Use this checklist when reviewing code changes.

---

## 1. Architecture

Check:

- React + TypeScript stack unchanged
    
- Manifest V3 unchanged
    
- No popup mode introduced
    
- Services still wrap Chrome APIs
    
- Workers used for heavy tasks
    

---

## 2. Maintainability

Check:

- No duplicate interfaces
    
- No duplicate utilities
    
- No dead code
    
- No temporary files
    
- No unclear file names
    
- Feature code stays in feature folder
    

---

## 3. Type Safety

Check:

- No unnecessary `any`
    
- Public functions have typed inputs and outputs
    
- Service responses are typed
    
- Worker messages are typed
    

---

## 4. Performance

Check:

- Large lists are virtualized
    
- Search is debounced
    
- Expensive calculations are memoized
    
- Event listeners are cleaned up
    
- Workers terminate or reuse safely
    

---

## 5. Security

Check:

- No analytics
    
- No telemetry
    
- No external data upload
    
- No unsafe HTML rendering
    
- User input validated
    

---

## 6. Chrome Extension Compliance

Check:

- Manifest V3 compatible
    
- Permissions minimized
    
- Service worker lifecycle considered
    
- No long-lived background memory assumptions
    

---

## 7. Tests

Check:

- Unit tests for new logic
    
- Component tests for UI behavior
    
- E2E tests for critical flows where relevant
    
- Build and typecheck pass
    

---

## 8. Final Review Output

Use this format:

```txt
Review result:
- Approved / Needs changes

Critical issues:
- ...

Suggestions:
- ...

Test status:
- ...
```

END