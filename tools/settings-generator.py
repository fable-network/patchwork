import json
import os
import sys

def main():

  # Settings file, prints to stdout on absence
  settings_file_location = sys.argv[1] if len(sys.argv) > 1 else None

  # Possible environments are 'test', 'dev' and 'prod', based on the environment shortName in the jenkins-jobs' seed_job.groovy.
  environment = os.environ.get('FT_ENVIRONMENT', None)

  # Check if there's a flag to disable sentry (used locally)
  disable_sentry = '--disable-sentry' in sys.argv

  environment_specific_variables = {
    'prod': {
      'gtm_post_url_params': '', #TO BE POPULATED
      'intercomId': '', #TO BE POPULATED
      'sentry_url': '' #TO BE POPULATED
    },
    'dev': {
      'gtm_post_url_params': '', #TO BE POPULATED
      'intercomId': '', #TO BE POPULATED
      'sentry_url': '' #TO BE POPULATED
    },
    'demo': {
      'gtm_post_url_params': '', #TO BE POPULATED
      'intercomId': '', #TO BE POPULATED
      'sentry_url': '' #TO BE POPULATED
    },
    'test': {
      'gtm_post_url_params': '', #TO BE POPULATED
      'intercomId': '', #TO BE POPULATED
      'sentry_url': '' #TO BE POPULATED
    }
  }

  if sorted(list(environment_specific_variables['dev'].keys())) != sorted(list(environment_specific_variables['prod'].keys())):
    print('Keys of dev and prod are not equal!')
    sys.exit(1)

  settings = """
var fashionTradeSettings = {
  environment: %s,
  gtmId: %s,
  gtmPostUrlParams: %s,
  intercomId: %s,
  sentry_url: %s
};""" % (
  json.dumps(environment),
  json.dumps(""), #TO BE POPULATED
  json.dumps(environment_specific_variables[environment]['gtm_post_url_params']),
  json.dumps(environment_specific_variables[environment]['intercomId']),
  json.dumps(environment_specific_variables[environment]['sentry_url'])
  )

  if settings_file_location:
    with open(settings_file_location, 'w') as settings_file:
      print(settings, file=settings_file)
      print(settings)
  else:
    print(settings)

if __name__ == '__main__':
  main()
