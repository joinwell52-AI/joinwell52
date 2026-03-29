"""
Cursor AI Team - 智能巡检触发器

流程：
  1. PM 写好任务单到 tasks/
  2. 双击 auto_patrol.bat 启动
  3. 初始通知：给所有工作窗口发一句"巡检"
  4. 常态监控：有新文件 → 催对应的人 → 检查他是否开始工作 → 没工作就再催

按 Ctrl+C 停止 | 鼠标移到屏幕左上角 = 紧急停止
"""
import pyautogui
import pyperclip
import time
import sys
import os
import glob

sys.stdout.reconfigure(encoding='utf-8')

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.2

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(SCRIPT_DIR, "patrol_templates")
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)

TASKS_DIR = os.path.join(PROJECT_DIR, "docs", "agents", "tasks")
REPORTS_DIR = os.path.join(PROJECT_DIR, "docs", "agents", "reports")

POLL_INTERVAL = 10       # 扫描目录间隔
CHECK_DELAY = 15         # 催完后等多久去检查是否开工
MAX_RETRY = 3            # 最多重催几次
MESSAGE = "巡检"
CONFIDENCE = 0.7

ROLE_TO_CHAT = {
    "DEV01": "3-DEV",
    "OPS01": "4-OPS",
    "QA01":  "2-QA",
    "PM01":  "1-PM",
}

ALL_WORKER_CHATS = ["2-QA", "3-DEV", "4-OPS", "1-PM"]


def find_on_screen(name):
    tpl = os.path.join(TEMPLATE_DIR, f"{name}.png")
    if not os.path.exists(tpl):
        return None
    try:
        loc = pyautogui.locateOnScreen(tpl, confidence=CONFIDENCE)
        if loc:
            return pyautogui.center(loc)
    except Exception:
        pass
    return None


def is_chat_working(chat_name):
    """检查 Chat 标签下方是否显示 Generating... = 正在工作"""
    chat_pos = find_on_screen(chat_name)
    if not chat_pos:
        return False

    gen_tpl = os.path.join(TEMPLATE_DIR, "generating.png")
    if not os.path.exists(gen_tpl):
        return False

    try:
        region = (
            chat_pos.x - 80,
            chat_pos.y + 5,
            160,
            25,
        )
        loc = pyautogui.locateOnScreen(gen_tpl, confidence=0.6, region=region)
        return loc is not None
    except Exception:
        return False


def click_and_send(chat_name):
    """点击 Chat 标签，粘贴"巡检"并回车"""
    pos = find_on_screen(chat_name)
    if not pos:
        return False

    pyautogui.click(pos)
    time.sleep(2)

    pyperclip.copy(MESSAGE)
    pyautogui.hotkey('ctrl', 'v')
    time.sleep(0.3)
    pyautogui.press('enter')
    time.sleep(0.5)
    return True


def notify_with_confirm(chat_name):
    """催一个人，然后确认他是否开始工作，没工作就再催"""
    ts = time.strftime("%H:%M:%S")

    for attempt in range(1, MAX_RETRY + 1):
        # 发送
        sent = click_and_send(chat_name)
        if not sent:
            print(f"  [{ts}] [失败] {chat_name} 屏幕上未找到")
            return False

        if attempt == 1:
            print(f"  [{ts}] [已催] {chat_name} <- '{MESSAGE}'")
        else:
            print(f"  [{ts}] [重催{attempt}] {chat_name} <- '{MESSAGE}'")

        # 等一会儿让他开始工作
        print(f"  [{ts}] 等 {CHECK_DELAY}秒 后检查是否开工...")
        time.sleep(CHECK_DELAY)

        # 检查是否在 Generating
        if is_chat_working(chat_name):
            print(f"  [{ts}] [确认] {chat_name} 已开工 ✓")
            return True
        else:
            if attempt < MAX_RETRY:
                print(f"  [{ts}] [未开工] {chat_name} 没反应，再催一次...")
            else:
                print(f"  [{ts}] [放弃] {chat_name} 催了{MAX_RETRY}次都没开工")

    return False


def scan_files(directory):
    pattern = os.path.join(directory, "*.md")
    return set(os.path.basename(f) for f in glob.glob(pattern))


def parse_recipient(filename):
    name = filename.replace(".md", "")
    if "-to-" in name:
        return name.split("-to-")[-1]
    return None


def parse_sender(filename):
    name = filename.replace(".md", "")
    if "-to-" in name:
        parts = name.split("-")
        for i, p in enumerate(parts):
            if p == "to":
                return parts[i - 1] if i > 0 else None
    return None


def decide_notify_targets(new_tasks, new_reports):
    targets = set()

    for f in new_tasks:
        recipient = parse_recipient(f)
        if recipient and recipient in ROLE_TO_CHAT:
            targets.add(ROLE_TO_CHAT[recipient])

    for f in new_reports:
        recipient = parse_recipient(f)
        if recipient and recipient in ROLE_TO_CHAT:
            targets.add(ROLE_TO_CHAT[recipient])

        sender = parse_sender(f)
        if sender == "DEV01":
            targets.add("4-OPS")
            targets.add("1-PM")
        elif sender == "OPS01":
            targets.add("2-QA")
            targets.add("1-PM")
        elif sender == "QA01":
            targets.add("1-PM")

    return targets


def initial_round():
    """第 3 步：给所有工作窗口发一轮巡检"""
    print("\n[第3步] 初始通知：给每个工作窗口说'巡检'...")

    for chat_name in ALL_WORKER_CHATS:
        notify_with_confirm(chat_name)
        time.sleep(2)

    print("\n初始通知完成。")


def monitor_loop():
    """第 4 步：常态监控"""
    print("\n[第4步] 进入常态监控...")
    print(f"  每 {POLL_INTERVAL}秒 扫描一次目录")
    print(f"  催完等 {CHECK_DELAY}秒 检查是否开工，没开工重催（最多{MAX_RETRY}次）")
    print()

    known_tasks = scan_files(TASKS_DIR)
    known_reports = scan_files(REPORTS_DIR)
    last_heartbeat = 0

    while True:
        try:
            time.sleep(POLL_INTERVAL)
            ts = time.strftime("%H:%M:%S")

            current_tasks = scan_files(TASKS_DIR)
            current_reports = scan_files(REPORTS_DIR)

            new_tasks = current_tasks - known_tasks
            new_reports = current_reports - known_reports

            if new_tasks or new_reports:
                for f in new_tasks:
                    print(f"\n[{ts}] 新任务: {f}")
                for f in new_reports:
                    print(f"\n[{ts}] 新报告: {f}")

                targets = decide_notify_targets(new_tasks, new_reports)

                for chat_name in sorted(targets):
                    notify_with_confirm(chat_name)
                    time.sleep(2)

                known_tasks = current_tasks
                known_reports = current_reports
            else:
                now = int(time.time())
                if now - last_heartbeat >= 60:
                    print(f"  [{ts}] 监控中...")
                    last_heartbeat = now

        except KeyboardInterrupt:
            print("\n\n巡检器已停止。")
            sys.exit(0)


def main():
    print("=" * 55)
    print("  Cursor AI Team - 智能巡检触发器")
    print("=" * 55)
    print()
    print("  1. PM 写好任务单        ✓")
    print("  2. 启动本程序            ← 现在")
    print("  3. 给每个窗口说'巡检'")
    print("  4. 常态监控：新文件→催人→确认开工")
    print()
    print("  Ctrl+C 停止 | 鼠标左上角 = 紧急停止")
    print("=" * 55)

    print(f"\n5秒后开始...")
    time.sleep(5)

    # 预检
    print("\n[预检] 模板匹配...")
    ok = 0
    for name in ALL_WORKER_CHATS:
        pos = find_on_screen(name)
        if pos:
            print(f"  {name}: OK @ ({pos.x}, {pos.y})")
            ok += 1
        else:
            print(f"  {name}: 未找到！")

    if ok == 0:
        print("\n模板全部未找到，请确保 Cursor 右侧面板可见。")
        input("按回车重试...")
        return main()

    # 第 3 步
    initial_round()

    # 第 4 步
    monitor_loop()


if __name__ == "__main__":
    main()
