from django.shortcuts import render

def render_content(context):
    content = context.get("content", "")
    for key, value in context.items():
        if key == "content":
            continue
        placeholder = f"{{{{ {key} }}}}"
        content = content.replace(placeholder, str(value))
    return content