<template>
  <div>
    <Paginator :page="1" :step="10" :total="10" />
    <Paginator :page="3" :step="10" :total="50" />
    <Paginator :page="5" :step="10" :total="50" />
    <Paginator :page="6" :step="10" :total="100" />
    <Paginator :page="1" :step="10" :total="1000" />
    <Paginator :page="5" :step="10" :total="1000" />
    <Paginator :page="10" :step="10" :total="1000" />
    <Paginator :page="50" :step="10" :total="1000" />
    <Paginator :page="98" :step="10" :total="1000" />
    <Paginator :page="100" :step="10" :total="1000" />
  </div>
</template>

<script>
import Paginator from '~/components/Paginator'

export default {
  components: { Paginator },
  watchQuery: ['page']
}
</script>
