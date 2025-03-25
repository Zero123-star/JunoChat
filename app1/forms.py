from django import forms
import datetime

from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class SignUpForm(UserCreationForm):
    profile_picture = forms.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'profile_picture']

from django.contrib.auth.forms import AuthenticationForm

class LogInForm(AuthenticationForm):
    remember_me = forms.BooleanField(
        required=False,
        initial=False,
        label='Remain logged in?'
    )
    

import re

class ContactForm(forms.Form):
    MESSAGE_CHOICES = [
        ('complaint', 'Complaint'),
        ('question', 'Question'),
        ('review', 'Review'),
        ('request', 'Request'),
        ('appointment', 'Appointment'),
    ]

    first_name = forms.CharField(max_length=10, required=True)
    last_name = forms.CharField(required=False)
    birth_date = forms.DateField(required=True)
    email = forms.EmailField(required=True)
    email_confirmation = forms.EmailField(required=True)
    message_type = forms.ChoiceField(choices=MESSAGE_CHOICES, required=True)
    subject = forms.CharField(required=True)
    minimum_waiting_days = forms.IntegerField(min_value=1)
    message = forms.CharField(widget=forms.Textarea, required=True,
                            label="Message (please sign with your first name at the end)")

    def clean_text_field(self, text, field_name):
        if not text:
            if field_name == 'last_name':
                return text
            raise forms.ValidationError(f"{field_name} is required")
        
        if not text[0].isupper():
            raise forms.ValidationError(f"{field_name} must start with a capital letter")
        
        if not re.match(r'^[A-Za-z\s]+$', text):
            raise forms.ValidationError(f"{field_name} can only contain letters and spaces")
        
        return text

    def clean_first_name(self):
        return self.clean_text_field(self.cleaned_data.get('first_name'), 'First name')

    def clean_last_name(self):
        return self.clean_text_field(self.cleaned_data.get('last_name'), 'Last name')

    def clean_subject(self):
        return self.clean_text_field(self.cleaned_data.get('subject'), 'Subject')

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        email_confirmation = cleaned_data.get('email_confirmation')
        birth_date = cleaned_data.get('birth_date')
        message = cleaned_data.get('message')
        first_name = cleaned_data.get('first_name')

        if email and email_confirmation and email != email_confirmation:
            raise forms.ValidationError("Email addresses do not match")

        if birth_date:
            age = (datetime.now().date() - birth_date).days / 365.25
            if age < 18:
                raise forms.ValidationError("You must be 18 or older to send a message")

        if message:
            words = re.findall(r'\w+', message)
            if len(words) < 5 or len(words) > 100:
                raise forms.ValidationError("Message must contain between 5 and 100 words")

            if re.search(r'\b(http://|https://)\S+', message):
                raise forms.ValidationError("Message cannot contain links")

            if not message.strip().endswith(first_name):
                raise forms.ValidationError("Message must end with your first name as signature")

        return cleaned_data