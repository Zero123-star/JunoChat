import logging
from django.contrib import messages

logger = logging.getLogger('app1')

import random
import string

def get_random_string(max_length):
    length = random.randint(100, max_length)
    random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    logger.debug(f"Generated random string for confirmation email link.")
    return random_string

from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import render, redirect

def custom_403(request, title=None, message=None):
    return HttpResponseForbidden(render(request, 'custom_403.html', context=
    {
        'message': message,
        'title': title
    }))
    
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.conf import settings

def send_conf_mail(user):
    try:
        context = {
            'full_name': f"{user.last_name} {user.first_name}",
            'username': user.username,
            'confirmation_url': f"{settings.SITE_URL}/app1/confirm_mail/{user.code}",
        }
        html_content = render_to_string('confirmation_email.html', context)

        email = EmailMessage(
            subject='Confirmation Email',
            body=html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email.content_subtype = 'html'
        email.send(fail_silently=False)
    except Exception as e:
        logger.critical(f"Error sending confirmation email: {e}")    
    
from django.core.mail import mail_admins
from django.contrib.auth import login
from .forms import SignUpForm


def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                user = form.save(commit=False)
                if user.username == 'admin':
                    email = user.email
                    mail_admins(
                        subject='Someone is trying to take over our site!',
                        message = f"Email: {email}",
                        html_message = f"<h1 style='color:red;'>Someone is trying to take over the site!</h1><p>Email: {email}</p>",
                        fail_silently=False
                    )
                    return HttpResponse("You cannot use 'admin' as your username!")
                user.confirmed_email = False
                user.code = get_random_string(100)
                user.save()
            except Exception as e:
                logger.critical(f"Error saving user: {e}")
                messages.warning(request, f"Unable to save user")
            send_conf_mail(user)
            messages.success(request, f"User {user.username} succesfully registered.")
            messages.info(request, f"Don't forget to confirm your email adress!")
            return redirect('login_view')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

from .forms import LogInForm
import collections
from django.utils.timezone import now

login_attempts = collections.defaultdict(list)

def login_view(request):
    if request.method == 'POST':
        form = LogInForm(data=request.POST, request=request)
        if form.is_valid():
            remember_me = form.cleaned_data['remember_me']
            user = form.get_user()
            if not user.confirmed_email:
                return HttpResponse("You must confirm your email adress to enter!")
            if user.blocked:
                return custom_403(request, message="Unfortunately, this account is currently blocked.", title="Blocked Account")
            login(request, user)
            request.session['user_id'] = user.id
            request.session['username'] = user.username
            request.session['email'] = user.email
            request.session['first_name'] = user.first_name
            request.session['last_name'] = user.last_name
            request.session['phone_number'] = user.phone_number
            request.session['country'] = user.country
            request.session['address'] = user.address
            logger.info(f"User {user.username} logged in.")
            remember_me = form.cleaned_data['remember_me']
            if not remember_me:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(24*60*60)          
            return redirect('profile') 
        else:
            ip = None
            try:
                x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
                if x_forwarded_for:
                    ip = x_forwarded_for.split(',')[0].strip()
                else:
                    ip = request.META.get('REMOTE_ADDR')
            except Exception as e:
                logger.error(f"Error getting ip address for {user.username}: {e}")
            login_attempts[user.username].append((ip, now()))
            login_attempts[user.username] = [
                attempt for attempt in login_attempts[user.username]
                if (now() - attempt[1]).total_seconds() < 120
            ]
            logger.debug(f"Login attempts for {user.username}: {login_attempts[user.username]}")
            if len(login_attempts[user.username]) < 3:
                messages.info(request, f"Failed login for {user.username}. Remaining attempts: \
                        {3 - len(login_attempts[user.username])}")
            else:
                messages.warning(request, f"You have failed to login 3 times.")
            if len(login_attempts[user.username]) >= 3:
                mail_admins(
                    subject='Suspicios Logins',
                    message = f"Username: {user.username}\nIP: {ip}",
                    html_message = f"<h1 style='color:red;'>Suspicious logins from </h1><p>Username: {user.username}</p><p>IP: {ip}</p>",
                    fail_silently=False
                )
    else:
        form = LogInForm()

    return render(request, 'login.html', {'form': form})


from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return redirect('login_view')

from django.contrib.auth.decorators import login_required
@login_required
def profile_view(request):
    user = request.user
    user_data = {
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "country": user.country,
        "address": user.address,
        "date_of_birth": user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None,
        "profile_picture": user.profile_picture.url if user.profile_picture else None,
    }
    request.session['user_data'] = user_data
    return render(request, 'profile.html', {"user_data": user_data})
    
    
from django.shortcuts import get_object_or_404
from .models import CustomUser

def confirm_email(request, code):
    user = get_object_or_404(CustomUser, code=code)
    user.confirmed_email = True
    user.save()
    logger.info(f"User {user.username} succesfully signed up.")
    return render(request, 'email_confirmed.html')


from .forms import ContactForm
import os, re, json, time
from datetime import datetime

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                data = form.cleaned_data.copy()
                birth_date = data['birth_date']
                today = datetime.now().date()
                years = today.year - birth_date.year
                months = today.month - birth_date.month
                
                if today.day < birth_date.day:
                    months -= 1
                if months < 0:
                    years -= 1
                    months += 12
                
                data['age'] = f"{years} years and {months} months"
                data['message'] = re.sub(r'\s+', ' ', data['message']).strip()
                del data['birth_date']
                del data['email_confirmation']
                
                app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                messages_dir = os.path.join(app_dir, 'messages')
                os.makedirs(messages_dir, exist_ok=True)
                
                timestamp = int(time.time())
                filename = f"message_{timestamp}.json"
                file_path = os.path.join(messages_dir, filename)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
                
                messages.success(request, 'Message sent successfully!')
            except Exception as e:
                mail_admins(
                    subject='Message error!',
                    message = f"Error: {e}",
                    html_message = f"<h1 style='color:red;'>Error occured while sending message!</h1><p>Error: {e}</p>",
                    fail_silently=False
                )
                logger.error(f"Error saving message: {e}")
                messages.error(request, 'Error occured while sending message!')
            return render(request, 'contact.html', {'form': ContactForm()})
    else:
        form = ContactForm()
    
    return render(request, 'contact.html', {'form': form})