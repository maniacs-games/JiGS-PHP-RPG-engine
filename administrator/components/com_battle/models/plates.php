<?php 
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport('joomla.application.component.modellegacy');
class battleModelPlates extends JModellegacy
{
    var $_data = null;
    function &getData()
    {
        if (empty($this->_data))
        {
            $query = "SELECT * FROM #__jigs_plates";
            $this->_data = $this->_getList($query);
        }
        return $this->_data;
    }
    function getpage()
    {
        $query = "SELECT * FROM #__jigs_plates";
        $this->_data2 = $this->_getList($query);
        //	echo $query;
        //	print_r($this->_data2);
        return $this->_data2;
    }

    function deletepage($cid)
    {
        $db     = JFactory::getDBO();

        if(count($cid))
        {
            $cids = implode(',',$cid);
            $query = "DELETE FROM #__jigs_plates WHERE id IN ($cids)";
            $db->setQuery($query);
            if($db->query())
            {
                return true;
            }
        }
        return false;
    }
}
