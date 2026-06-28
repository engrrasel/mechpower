import json
from django.shortcuts import render
from .models import ApplianceVariant

def home(request):
    variants = ApplianceVariant.objects.select_related('appliance').all()
    
    appliances_list = []
    for v in variants:
        if v.appliance.icon_image:
            icon_url = v.appliance.icon_image.url
        else:
            icon_url = '/static/solar_designer/images/default-icon.png'

        appliances_list.append({
            'id': v.id,
            'name': v.appliance.name,
            'category': v.appliance.category,
            'variant_name': v.variant_name,
            'watt': v.default_watt,
            'icon_url': icon_url,
            # এখন ভ্যারিয়েন্টের ভেতরের is_default ডাটা পাঠানো হচ্ছে
            'is_default': v.is_default 
        })
    
    context = {
        'appliances_json': json.dumps(appliances_list)
    }
    return render(request, "solar_designer/solar-designer.html", context)