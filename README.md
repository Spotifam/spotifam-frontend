This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Download and Run

1. Go to [Spotifam Auth Server](https://github.com/Spotifam/spotifam-auth) and follow its instructions to download and run it.
2. Either `git clone` or `git pull` this repo to your local machine
3. Run `npm install` to download the current node_modules
4. Run `npm start`. This will open the website on your localhost:3000

Note: In order to login to Spotify, you'll need this React server (localhost:3000) and the auth server (localhost:8888) running at the same time.

## Local Mobile Testing

### For Mac

1. Run `ifconfig` in terminal and look for your `inet address` under en0.
![instruction 1 image](https://lh3.googleusercontent.com/h_cbuovPXqswfjKUGQW1M3C57qwyCP8VlbUEJtHUEy4Z_ZEvS5r7cpJ0FjDvW5jWBZggZu1CNnW6Hj2pXCjJhrP2UEhsdTwGj_qmZMUAyI-_9w4xX2-_gNcBe_qaET7TFb63avqw7hjwgphuAu3cetka36m0C8-PQHLLACA-Ca3MJTl09Rj7e3IqbD-lox9ao_wOCwHrkQQP6u3IWgTZJuPYhK2JuNKimfEbLxprZCHR5ZYK7ozZGNPdJHfoCa5PTiHqRzQEA6I1W9DYAbKenTEiXyf1705kBAn3dpmunrRYhu1ssp3P1Hmh4C9XfT7rgTcXv6ylnLhwrDCgOZwETQ3ar72Cbwhgz_RDZQQ4ltRjyJwop7Ev7KRDeEAqhR7NpccBtUkJ4Y4eCCYh9Q4ek8Kr3Gicx6VcV7rwdruj0FcxSiakODuezcoV3TglbxYSFfffG0Jq1uSzJg5tgqrHY_F3Ec295Q8qvZJ5fqwg3eZfLetgoAIxBiDnyL7uRllKu3IFyIDwARn7i-7BJT2xvEEmB5uMPJ88-igthHxYwRguLui2XXk6xWwewv_HEiIncRE0qxuYgpV_x3-iV-P0EA3M2WbdmhP6JjbyUAsQCqzkXiZ2qaERr_q1P9mlG0UfU_OKFkJoo-hQmoho-yCM3iIzr-x-gRZN0utD5amVdM00Cj4CJM5yq1w=w1109-h758-no)
2. On your phone's web browser navigate to `inet address`:3000.
3. Now you should see the Spotifam landing page. All links will revert to localhost:3000 or localhost:8888 but continue changing localhost to the `inet address` you found in (1). 

### For Windows

1. Run `ipconfig` in the command line and find your ip address.
2. Follow (2) and (3) from above.
