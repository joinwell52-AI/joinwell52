"""Independent local disk probe for EventLog's dense view and durable seq."""

import json
import tempfile
from pathlib import Path

from openhands.sdk.conversation.event_store import EventLog
from openhands.sdk.event.llm_convertible import MessageEvent
from openhands.sdk.io.local import LocalFileStore
from openhands.sdk.llm import Message, TextContent


def event(number: int) -> MessageEvent:
    return MessageEvent(
        id=f"00000000-0000-4000-8000-{number:012d}",
        llm_message=Message(
            role="user", content=[TextContent(text=f"message {number}")]
        ),
        source="user",
    )


with tempfile.TemporaryDirectory(prefix="eventlog-gap-") as root:
    log = EventLog(LocalFileStore(root))
    for number in range(4):
        log.append(event(number))
    files = sorted((Path(root) / "events").glob("event-*.json"))
    assert len(files) == 4
    files[1].unlink()
    restored = EventLog(LocalFileStore(root))
    visible = [str(item.id) for item in restored]
    seqs = [restored.get_seq(i) for i in range(len(restored))]
    cursor_after_zero = restored.index_after_seq(0)
    result = {
        "files_before": [p.name for p in files],
        "deleted": files[1].name,
        "visible_event_ids": visible,
        "visible_indexes": list(range(len(restored))),
        "durable_seqs": seqs,
        "cursor_after_zero": cursor_after_zero,
        "surviving_ids_reachable": [restored.get_id(i) for i in range(len(restored))],
    }
    assert seqs == [0, 2, 3]
    assert cursor_after_zero == 1
    assert len(visible) == 3
    print(json.dumps(result, ensure_ascii=False, indent=2))
