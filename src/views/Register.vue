<template>
  <div class="Register">
  </div>
</template>
<script>
import axios from 'axios'

export default {
    data() {
        return {
        }
    },
    mounted() {
      axios.post(process.env.VUE_APP_BASE_URL + 'script/check_register/' + this.$route.params.id).then(({data}) => {
        if (data.data) {
          this.$router.push('/login')
        } else {
          this.$router.push('/registerInfo/' + this.$route.params.id)
        }
      })
    }
}
</script>